import json, base64, hashlib, hmac, boto3, os

def xor_decrypt(ciphertext, key):
    return ''.join(chr(ord(c) ^ ord(key[i % len(key)])) for i, c in enumerate(ciphertext))

def previous_permutation(s):
    arr = list(s)
    i = len(arr) - 1
    while i > 0 and arr[i - 1] <= arr[i]: i -= 1
    if i <= 0: return None
    j = len(arr) - 1
    while arr[j] >= arr[i - 1]: j -= 1
    arr[i - 1], arr[j] = arr[j], arr[i - 1]
    arr[i:] = reversed(arr[i:])
    return ''.join(arr)

def hmac_stream_decrypt(data: bytes, password: str) -> bytes:
    return hmac_stream_encrypt(data, password)

def hmac_stream_encrypt(data: bytes, password: str) -> bytes:
    key = hashlib.sha256(password.encode()).digest()
    result, counter = bytearray(), 0
    for i in range(0, len(data), 32):
        pad = hmac.new(key, counter.to_bytes(4, 'big'), hashlib.sha256).digest()
        result.extend(b ^ p for b, p in zip(data[i:i+32], pad))
        counter += 1
    return bytes(result)

def lambda_handler(event, context):
    # Handle CORS preflight
    if event.get("httpMethod") == "OPTIONS":
        return {
            "statusCode": 200,
            "headers": {
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Headers": "*",
                "Access-Control-Allow-Methods": "POST,OPTIONS"
            },
            "body": json.dumps({"message": "CORS preflight successful"})
        }

    s3 = boto3.client('s3')
    bucket = 'encrypted-one'

    try:
        body = json.loads(event['body'])
        filename = body['filename']
        file_b64 = body['fileContent']
        fed_key_hex = body['key']

        fed_key = bytes.fromhex(fed_key_hex)
        xor_key = fed_key[:32].hex()
        aes_key = fed_key[32:].hex()

        encrypted_bytes = base64.b64decode(file_b64)
        decrypted_permuted = hmac_stream_decrypt(encrypted_bytes, aes_key).decode()
        original_base64 = previous_permutation(decrypted_permuted)
        xor_bytes = base64.b64decode(original_base64)
        decrypted_text = xor_decrypt(xor_bytes.decode(), xor_key)

        decrypted_filename = os.path.splitext(filename)[0] + "_decrypted.txt"
        s3.put_object(Bucket=bucket, Key=decrypted_filename, Body=decrypted_text)

        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Headers': '*',
                'Access-Control-Allow-Methods': 'POST,OPTIONS'
            },
            'body': json.dumps({
                'decrypted': decrypted_text,
                'filename': decrypted_filename
            })
        }
    except Exception as e:
        return {
            'statusCode': 500,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Headers': '*',
                'Access-Control-Allow-Methods': 'POST,OPTIONS'
            },
            'body': json.dumps({'error': str(e)})
        }