from rest_framework import serializers
from .models import BlogData , Bloggers

class UserSerializer(serializers.ModelSerializer):
    password = serializers.CharField(max_length=100, write_only=True)
    email = serializers.EmailField(max_length=200, write_only=True)
    first_name = serializers.CharField(max_length=200, write_only=True)
    last_name = serializers.CharField(max_length=200, write_only=True)
    id = serializers.CharField(max_length=1000, write_only=True)
    username = serializers.CharField(max_length=1000, write_only=True)
    class Meta:
        model = BlogData
        fields = ['username','email', 'password', 'first_name', 'last_name', 'id']
    def create(self, data):
        return BlogData.objects.create_user(**data)

class BloggersSerializer(serializers.ModelSerializer):
    blog_data = serializers.CharField(max_length=40000, write_only=True)
    title_of_blog = serializers.CharField(max_length=40000, write_only=True)
    uuid_blog_data = serializers.CharField(max_length=90)
    id = serializers.CharField(max_length=1000, write_only=True)
    date_created = serializers.DateTimeField(write_only=True)
    class Meta:
        model = Bloggers
        fields = ['title_of_blog','uuid_blog_data','blog_data','id','date_created']


# =====================Login token genreated===================================
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
class MyTokenObtainPairSerializer(TokenObtainPairSerializer):
    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)
        # Add custom claims
        # token['iat'] = datetime.datetime.now()
        token['email'] = user.email
        token['user'] = user.username
        return token
# =============================================================================

class Obtain_Refresh_And_Access(TokenObtainPairSerializer):
    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)
        # token['iat'] = datetime.datetime.now()
        token['email'] = user.email
        token['user'] = user.username
        return token
