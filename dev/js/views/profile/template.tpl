<mobile-view class="profile_page">
	<mobile-header title="Profile" class='no-shadow'></mobile-header>
	<div class="content">
		<%
			var user_image = (mobileApp.currentUser.image == null) ? 'img/default_user_icon.png' : mobileApp.settings.imageURL + mobileApp.currentUser.user_image;
			var backgroundImage = (mobileApp.currentUser.image == null) ? '' : 'background-image:url('+mobileApp.settings.imageURL + mobileApp.currentUser.user_image+')';
		%>
		<div class="bg-image" style="<%= backgroundImage %>"></div>
		<div class="header">

			<profile-image image="<%= user_image%>"></profile-image>
			<h2><%= mobileApp.currentUser.first_name %> <%= mobileApp.currentUser.last_name %></h2>
			<h4><%= mobileApp.currentUser.username %></h4>
			<button class="systemButton edit" style="margin-bottom:10px;"> Edit Profile </button>
			<button class="systemButton logout"> Logout </button>
		</div>
	</div>
</mobile-view>
