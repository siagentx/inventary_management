from fastapi import Depends,APIRouter
from sqlalchemy.orm import Session
from app.services import auth_service
from app.dependencies import get_db
from app.schemas.user import UserCreate,UserResponse
from fastapi.security import OAuth2PasswordRequestForm

router=APIRouter(
    prefix='/auth',tags=['Authentication']
)

@router.post('/register',response_model=UserResponse,status_code=201)
def register(user:UserCreate,db:Session=Depends(get_db)):
    return auth_service.register(user,db)

@router.post("/login")
def login(formdata:OAuth2PasswordRequestForm=Depends(),db:Session=Depends(get_db)):
    return auth_service.login(formdata,db)
