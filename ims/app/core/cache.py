import json
from app.core.redis import redis_client

CACHE_EXPIRE = 60

def get_cache(key: str):
    try:
        data = redis_client.get(key)
        if data:
            return json.loads(data)
        return None
    except Exception as e:
        print(f"Redis GET Error: {e}")
        return None


def set_cache(key: str, value):
    try:
        redis_client.setex(
            key,
            CACHE_EXPIRE,
            json.dumps(value)
        )
    except Exception as e:
        print(f"Redis SET Error: {e}")


def delete_cache(key: str):
    try:
        redis_client.delete(key)
        print(f"🗑 Cache '{key}' deleted")
    except Exception as e:
        print(f"Redis DELETE Error: {e}")