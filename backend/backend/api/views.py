import base64
import io
import json
import os
import re
import requests
from django.contrib.auth.hashers import make_password
from django.core.files.storage import FileSystemStorage
from django.http import HttpResponseRedirect
from rest_framework.generics import GenericAPIView
from rest_framework.parsers import JSONParser
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from .serializers import UserSerializer, MyTokenObtainPairSerializer, BloggersSerializer, Obtain_Refresh_And_Access
from rest_framework import status
from rest_framework.response import Response
from rest_framework_simplejwt.views import (TokenObtainPairView)
from .models import BlogData, Bloggers
from datetime import datetime
from django.views.decorators.csrf import csrf_exempt


class RegisterView(GenericAPIView):
    def post(self, request, *args, **kwargs):
        try:
            json_data = request.body
            stream = io.BytesIO(json_data)
            user_data_dic = JSONParser().parse(stream)
            if len(user_data_dic["recapcha"]) == 0:
                return Response({"message": "Recapcha invalid"}, status=status.HTTP_400_BAD_REQUEST)
            secret = "6LdjEeQaAAAAAAFIGHyO4CzqEcsBrVKI0DeWFtwg"
            url = f"https://www.google.com/recaptcha/api/siteverify?secret={secret}&response={user_data_dic['recapcha']}"
            x = requests.post(url)
            response_dict = json.loads(x.text)
            if response_dict["success"] == True:
                pass
            else:
                return Response({"message": "Invalid capcha"}, status=status.HTTP_400_BAD_REQUEST)
        except:
            return Response({"message": "Recapcha Not provided !!! "},
                            status=status.HTTP_400_BAD_REQUEST)
        try:
            if (BlogData.objects.get(email=user_data_dic.get('email'))):
                return Response({"Error": "Email", "message": "Email Already registered"},
                                status=status.HTTP_400_BAD_REQUEST)
        except:
            pass
        try:
            import uuid
            uuid = uuid.uuid4()
            user_data_dic['username'] = user_data_dic.get('first_name');
            user_data_dic['id'] = str(uuid);

            if (BlogData.objects.get(id=str(uuid))):
                return Response({"message": "Something went wrong"}, status=status.HTTP_400_BAD_REQUEST)
        except:
            pass
        # print(user_data_dic)
        serializer = UserSerializer(data=user_data_dic)
        if serializer.is_valid():
            serializer.save()
            return Response({
                "message": "Register succesfully",
                "email": user_data_dic.get('email'),
                "username": user_data_dic.get('username'),
                "first_name": user_data_dic.get('first_name'),
                "last_name": user_data_dic.get('last_name'),
                "id": user_data_dic.get('id')
            }, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        # return JsonResponse({"message": "Final"},status=status.HTTP_201_CREATED)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_data_of_user(request):
    try:
        Entry = BlogData.objects.filter(id=request.user.id).values("id", "email", "username", "date_joined",
                                                                   "image_url")
        return Response(list(Entry), status=status.HTTP_200_OK)
    except:
        return Response({"message": "something went awww sorry !!!!"}, status=status.HTTP_400_BAD_REQUEST)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def upload_profile(request):
    try:
        img_details = request.FILES['image']
        fs = FileSystemStorage()
        filter_extension = os.path.splitext(img_details.name)

        Extract_image_name = BlogData.objects.filter(id=request.user.id).values("image_url")
        _delete_first_ = Extract_image_name[0]["image_url"]
        if (filter_extension[-1] == ".jpg" or filter_extension[-1] == ".png" or filter_extension[-1] == ".jpeg" or
                filter_extension[-1] == ".gif"):
            if os.path.exists("C:/xampp/htdocs/image"):
                # print("_Y_")
                if (_delete_first_ == "profile.png"):
                    print("")
                else:
                    os.remove("C:/xampp/htdocs/image/" + _delete_first_)
            else:
                # print("_N_")
                return Response({"message": "you don't have permission"}, status=status.HTTP_400_BAD_REQUEST)
        else:
            print("")
            return Response({"message": "provide a valid file !!! "}, status=status.HTTP_400_BAD_REQUEST)

        img_details.name = request.user.id + filter_extension[-1]
        from PIL import Image
        import PIL
        im1 = Image.open(img_details)
        im1.save("C:/xampp/htdocs/image/" + img_details.name)
        BlogData.objects.filter(id=request.user.id).update(image_url=img_details.name)
        return Response({"message": "Profile change"}, status=status.HTTP_200_OK)
    except:
        return Response({"message": "something went awww sorry !!!!"}, status=status.HTTP_400_BAD_REQUEST)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def change_user_name(request):
    try:
        json_data = request.body
        stream = io.BytesIO(json_data)
        user_data_dic = JSONParser().parse(stream)
        if len(user_data_dic["Username"]) >= 25:
            return Response({"message": "Character to long "}, status=status.HTTP_400_BAD_REQUEST)
        if len(user_data_dic["Username"]) <= 3:
            return Response({"message": "Character to short "}, status=status.HTTP_400_BAD_REQUEST)
        _unuual_character_ = re.compile('[@_!#$%^&*()<>?/\|}{~:]')
        if (_unuual_character_.search(user_data_dic["Username"]) == None):
            print("Username is accepted")
        else:
            return Response({"message": "Character must be valid"}, status=status.HTTP_400_BAD_REQUEST)
        BlogData.objects.filter(id=request.user.id).update(username=user_data_dic["Username"])
        return Response({"message": "Profile name changed"}, status=status.HTTP_200_OK)
    except:
        return Response({"message": "something went awww sorry !!!!"}, status=status.HTTP_400_BAD_REQUEST)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def change_user_email(request):
    try:
        json_data = request.body
        stream = io.BytesIO(json_data)
        user_data_dic = JSONParser().parse(stream)
        regex = '^(\w|\.|\_|\-)+[@](\w|\_|\-|\.)+[.]\w{2,3}$'
        if (re.search(regex, user_data_dic["email"])):
            print("Valid Email")
            BlogData.objects.filter(id=request.user.id).update(email=user_data_dic["email"])
            return Response({"message": "Profile email changed"}, status=status.HTTP_200_OK)
        else:
            return Response({"message": "Not a valid email"}, status=status.HTTP_400_BAD_REQUEST)
    except:
        return Response({"message": "something went awww sorry !!!!"}, status=status.HTTP_400_BAD_REQUEST)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def change_user_password(request):
    try:
        json_data = request.body
        stream = io.BytesIO(json_data)
        user_data_dic = JSONParser().parse(stream)
        print(user_data_dic["password"])
        hashed_pwd = make_password(user_data_dic["password"])
        print(hashed_pwd)
        BlogData.objects.filter(id=request.user.id).update(password=hashed_pwd)
        return Response({"message": "Password changed"}, status=status.HTTP_200_OK)
    except:
        return Response({"message": "something went awww sorry !!!!"}, status=status.HTTP_400_BAD_REQUEST)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def User_Blog_Insert(request):
    try:
        json_data = request.body
        stream = io.BytesIO(json_data)
        user_data_dic = JSONParser().parse(stream)
        if len(user_data_dic["recapcha"]) == 0:
            return Response({"message": "Recapcha invalid"}, status=status.HTTP_400_BAD_REQUEST)
        secret = "6LdjEeQaAAAAAAFIGHyO4CzqEcsBrVKI0DeWFtwg"
        import requests
        url = f"https://www.google.com/recaptcha/api/siteverify?secret={secret}&response={user_data_dic['recapcha']}"
        x = requests.post(url)
        response_dict = json.loads(x.text)
        if (response_dict["success"] == True):
            pass
        else:
            return Response({"message": "Invalid capcha"}, status=status.HTTP_400_BAD_REQUEST)
    except:
        return Response({"message": "All fields required !!! "}, status=status.HTTP_400_BAD_REQUEST)
    serializer = BloggersSerializer(request.user, many=False)
    json_data = request.body
    stream = io.BytesIO(json_data)
    user_data_dic = JSONParser().parse(stream)
    now = datetime.now()
    import uuid
    uuid = uuid.uuid4()
    user_data_dic['id'] = str(uuid);
    user_data_dic['uuid_blog_data'] = request.user.id
    user_data_dic['date_created'] = request.user.id
    user_data_dic['date_created'] = now
    try:
        if (Bloggers.objects.get(id=user_data_dic['id'])):
            return Response({"Error": "some where in space", "message": "Went wrong"},
                            status=status.HTTP_400_BAD_REQUEST)
    except:
        pass
    serializer_blog = BloggersSerializer(data=user_data_dic)
    # print(serializer_blog)
    # print(user_data_dic)
    if serializer_blog.is_valid():
        serializer_blog.save()
        return Response({
            "message": "Blog Published",
            "id": user_data_dic.get('id'),
            "title_of_blog": user_data_dic.get('title_of_blog'),
            "date_created": user_data_dic.get('date_created')
        }, status=status.HTTP_201_CREATED)
    return Response(serializer_blog.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['POST'])
def single_blog_data(request):
    try:
        json_data = request.body
        stream = io.BytesIO(json_data)
        user_data_dic = JSONParser().parse(stream)
        Entry = Bloggers.objects.filter(id=user_data_dic["blog_id"]).values("uuid_blog_data")
        import random
        n = random.randint(0, 22)
        try:
            for data_in_range in range(len(Entry)):
                single_blog_data = Bloggers.objects.filter(id=request.data["blog_id"]).values()[0]
                return Response({
                    "id": single_blog_data["id"],
                    "title_of_blog": single_blog_data["title_of_blog"],
                    "blog_data": single_blog_data["blog_data"],
                    "date_created": single_blog_data["date_created"],
                    "link": "http://localhost:8000/api/data_details/user",
                    "key": random.randint(0, 22)
                }, status=status.HTTP_200_OK)
        except:
            return Response({"message": "You requested blog was not found !!!"}, status=status.HTTP_400_BAD_REQUEST)
        return Response({"message": "You requested blog was not found !!!"}, status=status.HTTP_400_BAD_REQUEST)
    except:
        return Response({"message": "You requested blog was not found !!!"}, status=status.HTTP_400_BAD_REQUEST)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def single_blog_published(request):
    try:
        json_data = request.body
        stream = io.BytesIO(json_data)
        user_data_dic = JSONParser().parse(stream)
        Entry = Bloggers.objects.filter(id=user_data_dic["blog_id"]).values("uuid_blog_data")
        import random
        n = random.randint(0, 22)
        try:
            for data_in_range in range(len(Entry)):
                single_blog_data = Bloggers.objects.filter(id=request.data["blog_id"]).values()[0]
                return Response({
                    "id": single_blog_data["id"],
                    "title_of_blog": single_blog_data["title_of_blog"],
                    "blog_data": single_blog_data["blog_data"],
                    "date_created": single_blog_data["date_created"],
                    "link": "http://localhost:8000/api/data_details/user",
                    "key": random.randint(0, 22)
                }, status=status.HTTP_200_OK)
        except:
            return Response({"message": "You requested blog was not found !!!"}, status=status.HTTP_400_BAD_REQUEST)
        return Response({"message": "You requested blog was not found !!!"}, status=status.HTTP_400_BAD_REQUEST)
    except:
        return Response({"message": "You requested blog was not found !!!"}, status=status.HTTP_400_BAD_REQUEST)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def user_blog_edit(request):
    try:
        serializer = BloggersSerializer(request.user, many=False)
        json_data = request.body
        stream = io.BytesIO(json_data)
        user_data_dic = JSONParser().parse(stream)
        from django.contrib.auth import get_user_model
        User = get_user_model()
        Entry = Bloggers.objects.filter(uuid_blog_data=request.user.id).values('id', 'title_of_blog',
                                                                               'blog_data')  # return ValuesQuerySet object
        time_from_data = Bloggers.objects.filter(id=user_data_dic["id"]).values('date_created')
        for course in time_from_data:
            exact_time_created = course['date_created']
        user_data_dic["date_created"] = exact_time_created
        user_data_dic["uuid_blog_data"] = request.user.id
        for data_in_range in range(len(Entry)):
            if Entry[data_in_range]["id"] == user_data_dic["id"]:
                serializer_blog_edit = BloggersSerializer(data=user_data_dic)
                if serializer_blog_edit.is_valid():
                    Bloggers.objects.filter(pk=Entry[data_in_range]["id"]).update(id=user_data_dic["id"],
                                                                                  title_of_blog=user_data_dic[
                                                                                      "title_of_blog"],
                                                                                  blog_data=user_data_dic["blog_data"],
                                                                                  date_created=user_data_dic[
                                                                                      "date_created"],
                                                                                  uuid_blog_data=user_data_dic[
                                                                                      "uuid_blog_data"])
                else:
                    return Response(serializer_blog_edit.errors, status=status.HTTP_400_BAD_REQUEST)
                return Response({"message": "Edited succesfully", "blog_id": user_data_dic["id"],
                                 "title_of_blog": user_data_dic["title_of_blog"],
                                 "blog_data": user_data_dic["blog_data"]}, status=status.HTTP_200_OK)
            else:
                print("")
        return Response({"message": "You don't have permission to edit data"}, status=status.HTTP_400_BAD_REQUEST)
    except:
        return Response({"message": "Blog id was not found try again !!!"}, status=status.HTTP_400_BAD_REQUEST)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def User_Blog_Data(request):
    serializer = BloggersSerializer(request.user, many=False)
    from django.contrib.auth import get_user_model
    User = get_user_model()
    Entry = Bloggers.objects.filter(uuid_blog_data=request.user.id).values('id', 'title_of_blog',
                                                                           'blog_data')  # return ValuesQuerySet object
    return Response(list(Entry), status=status.HTTP_200_OK)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def user_blog_delete(request):
    try:
        serializer = BloggersSerializer(request.user, many=False)
        json_data = request.body
        stream = io.BytesIO(json_data)
        user_data_dic = JSONParser().parse(stream)
        from django.contrib.auth import get_user_model
        User = get_user_model()
        Entry = Bloggers.objects.filter(uuid_blog_data=request.user.id).values('id', 'title_of_blog',
                                                                               'blog_data')  # return ValuesQuerySet object
        for data_in_range in range(len(Entry)):
            if Entry[data_in_range]["id"] == user_data_dic["id"]:
                var = "Yep Yep"
                Bloggers.objects.filter(id=user_data_dic["id"]).delete()
                return Response({"id": user_data_dic["id"], "message": "Blog Deleted"}, status=status.HTTP_200_OK)
            else:
                var = "Nope Nope"
        return Response({"message": "You don't have permission to edit data"}, status=status.HTTP_400_BAD_REQUEST)
    except:
        return Response({"message": "Something went wrong in space"}, status=status.HTTP_400_BAD_REQUEST)


@api_view(['GET'])
def user_blog_list_blog(req):
    try:
        data = list(Bloggers.objects.values())
        # print(data)
        return Response(data, status=status.HTTP_200_OK)
    except:
        return Response({"message": "Something went wrong in space"}, status=status.HTTP_400_BAD_REQUEST)


class MyTokenObtainPairView(TokenObtainPairView):
    serializer_class = MyTokenObtainPairSerializer


@csrf_exempt
def logout(request):
    if request.method == 'POST':
        response = HttpResponseRedirect('')
        response.delete_cookie('refresh')
        return response
    else:
        content = {'message': 'Something went wrong in space'}
        return Response(content)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def user_new_access_and_refrsh_token_and(request):
    try:
        if request.COOKIES.get('refresh'):
            token = request.COOKIES.get('refresh')
            splitted_token = token.split(".")
            second_base64_string = splitted_token[1]
            second_base64_string_bytes = second_base64_string.encode('ascii')
            jwt_bytes = base64.b64decode(second_base64_string_bytes + b'=' * (-len(second_base64_string_bytes) % 4))
            jwt_decoded = jwt_bytes.decode('ascii')
            jwt_decoded = json.loads(jwt_decoded)
            exp = jwt_decoded["exp"]
            import time
            time_expired_check = exp - time.time()
            if time_expired_check <= 0:
                return Response({"message": "Refresh token Expired"}, status=status.HTTP_400_BAD_REQUEST)
            else:
                pass
            if jwt_decoded["token_type"] != "refresh":
                return Response({"message": "Not valid refresh token"}, status=status.HTTP_400_BAD_REQUEST)
            else:
                pass
            if jwt_decoded["user_id"] == request.user.id:
                pass
            else:
                return Response({"message": "Something went wrong in space"}, status=status.HTTP_400_BAD_REQUEST)
            user = BlogData.objects.get(id=request.user.id)
            refresh = Obtain_Refresh_And_Access.get_token(user)
            response = Response({"access": str(refresh.access_token)}, status=status.HTTP_200_OK)
            response.set_cookie('refresh', refresh, samesite="none", secure=True, httponly=True)
            return response
        else:
            return Response({"message": "Refresh token not provided"}, status=status.HTTP_400_BAD_REQUEST)
    except:
        return Response({"message": "Something went wrong in space"}, status=status.HTTP_400_BAD_REQUEST)
    return Response({"message": "Something went wrong in space"}, status=status.HTTP_400_BAD_REQUEST)
