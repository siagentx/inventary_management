from fastapi import Request,HTTPException
from fastapi.responses import JSONResponse


async def http_exception_handler(request:Request,exc:HTTPException):
    return JSONResponse(
        status_code=exc.status_code,
        content={
            "success":False,
            "message":exc.detail
        }
    )

def register_exception_handlers(app):
    app.add_exception_handler(HTTPException,http_exception_handler)
    