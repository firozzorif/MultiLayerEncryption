from FED import generate_fed_key
import json, base64, hashlib, hmac, boto3, os

def xor_encrypt(text, key):
    return ''.join(chr(ord(c) ^ ord(key[i % len(key)])) for i, c in enumerate(text))

def next_permutation(s):
    arr = list(s)
    i = len(arr) - 2
    while i >= 0 and arr[i] >= arr[i + 1]: i -= 1
    if i < 0: return None
    j = len(arr) - 1
    while arr[j] <= arr[i]: j -= 1
    arr[i], arr[j] = arr[j], arr[i]
    arr[i + 1:] = reversed(arr[i + 1:])
    return ''.join(arr)

def hmac_stream_encrypt(data: bytes, password: str) -> bytes:
    key = hashlib.sha256(password.encode()).digest()
    result, counter = bytearray(), 0
    for i in range(0, len(data), 32):
        pad = hmac.new(key, counter.to_bytes(4, 'big'), hashlib.sha256).digest()
        result.extend(b ^ p for b, p in zip(data[i:i+32], pad))
        counter += 1
    return bytes(result)

def lambda_handler(event, context):
    s3 = boto3.client('s3')
    bucket = 'encrypted-one'

    try:
        body = json.loads(event['body'])
        filename = body['filename']
        file_b64 = body['fileContent']
        text = base64.b64decode(file_b64).decode('utf-8')

        key_data = generate_fed_key()
        fed_key = key_data['private_key']
        xor_key, aes_key = fed_key[:32].hex(), fed_key[32:].hex()

        xor_encrypted = xor_encrypt(text, xor_key)
        permuted = next_permutation(base64.b64encode(xor_encrypted.encode()).decode())
        encrypted_bytes = hmac_stream_encrypt(permuted.encode(), aes_key)

        encrypted_b64 = base64.b64encode(encrypted_bytes).decode()
        encrypted_filename = os.path.splitext(filename)[0] + "_encrypted.txt"

        s3.put_object(Bucket=bucket, Key=encrypted_filename, Body=encrypted_b64)

        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Headers': '*',
                'Access-Control-Allow-Methods': 'POST,OPTIONS'
            },
            'body': json.dumps({
                'fileContent': encrypted_b64,
                'filename': encrypted_filename,
                'key': fed_key.hex()
            })
        }
    except Exception as e:
        return {
            'statusCode': 500,
            'body': json.dumps({'error': str(e)})
        }