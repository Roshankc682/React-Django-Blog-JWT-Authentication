from django.urls import path
from .views import *
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
)
from . import views
urlpatterns = [
# handler404

    # path('api/recapcha/',recapcha, name='recapcha'),

    path('register/',views.RegisterView.as_view(), name='Register_account'),
    path('api/token/', views.MyTokenObtainPairView.as_view(), name='Token_create'),
    path('api/token/new/', views.user_new_access_and_refrsh_token_and, name='Token_refresh_of_reflecting_acces_token'),
    path('api/access/refresh/', TokenRefreshView.as_view(), name='Get_access_if_page_refresh'),
    path('logout/', logout, name='logout'),

    path('api/get_data_of_user/', views.get_data_of_user, name='get_data_of_user'),
    path('api/____/upload_profile/user/', views.upload_profile, name='upload_profile'),
    path('api/____/change_user_name/', views.change_user_name, name='change_user_name'),
    path('api/____/change_email_/', views.change_user_email, name='change_user_email'),
    path('api/____/change_pass_/', views.change_user_password, name='change_user_password'),
    path('api/blog_data/', views.User_Blog_Data, name='User_Blog_Data'),
    path('api/data_insert/', views.User_Blog_Insert, name='User_Blog_Insert'),
    path('api/data_edit/', views.user_blog_edit, name='User_Blog_Edit'),
    path('api/data_delete/', views.user_blog_delete, name='User_Blog_Delete'),
    path('api/list_blog/', views.user_blog_list_blog, name='User_Blog_list_Blog'),
    path('api/single_blog_published/', views.single_blog_published, name='list_blog_to_edit_only_one_for_practice_for_authorized_only'),
    path('api/single_blog_data/', views.single_blog_data, name='single_blog_data_for_not_login'),
]
