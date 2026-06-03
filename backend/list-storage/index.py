"""List files in S3 storage bucket."""
import json
import os
import boto3


def handler(event: dict, context) -> dict:
    """Список файлов в S3 хранилище."""
    cors_headers = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
    }

    if event.get('httpMethod') == 'OPTIONS':
        return {'statusCode': 200, 'headers': cors_headers, 'body': ''}

    s3 = boto3.client(
        's3',
        endpoint_url='https://bucket.poehali.dev',
        aws_access_key_id=os.environ['AWS_ACCESS_KEY_ID'],
        aws_secret_access_key=os.environ['AWS_SECRET_ACCESS_KEY']
    )

    prefix = event.get('queryStringParameters', {}).get('prefix', '') if event.get('queryStringParameters') else ''

    all_files = []
    for bucket_name in ['files', 'catalog', 'images', 'uploads']:
        try:
            response = s3.list_objects_v2(Bucket=bucket_name, Prefix=prefix)
            for obj in response.get('Contents', []):
                key = obj['Key']
                cdn_url = f"https://cdn.poehali.dev/projects/{os.environ['AWS_ACCESS_KEY_ID']}/bucket/{key}"
                all_files.append({'key': key, 'bucket': bucket_name, 'url': cdn_url, 'size': obj['Size']})
        except Exception as e:
            pass
    files = all_files

    return {
        'statusCode': 200,
        'headers': {**cors_headers, 'Content-Type': 'application/json'},
        'body': json.dumps({'files': files, 'count': len(files)}, ensure_ascii=False)
    }