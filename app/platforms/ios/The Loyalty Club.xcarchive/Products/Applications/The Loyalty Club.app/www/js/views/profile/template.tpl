<mobile-view class="profile_page">
	<mobile-header title="Profile" class='no-shadow' icon="./img/qr_icon.png"></mobile-header>
	<div class="content">
		<%
			var user_image = (mobileApp.currentUser.image == null) ? 'img/default_user_icon.png' : mobileApp.settings.imageURL + mobileApp.currentUser.user_image;
		%>
		<div class="header">

			<profile-image image="<%= user_image%>"></profile-image>
			<h2><%= mobileApp.currentUser.first_name %> <%= mobileApp.currentUser.last_name %></h2>
			<h4>Loyalty Club Member Since <%= mobileApp.currentUser.created_at.split('-')[0] %></h4>
		<!--	<button class="systemButton edit" style="margin-bottom:10px;"> Edit Profile </button>
			<button class="systemButton logout"> Logout </button>-->
		</div>
		<div class="options">
			<div class="tabbar flex-none">
				<div class="tabbar__tab active" data-ui-href="recent_activity">Recent Activity</div>
				<div class="tabbar__tab" data-ui-href="settings">Settings</div>
			</div>
			<div class="tab__content active" data-id="recent_activity">

			</div>
			<div class="tab__content" data-id="settings">
				<ul>
					<li>Rate the App</li>
					<li>Get Passbook Pass</li>
					<li>Manage Rewards Programs</li>
					<li class="spacer"></li>
					<li>FAQ</li>
					<li>Contact The Loyalty Club</li>
					<li>Terms & Conditions</li>
					<li>Privacy Policy</li>
					<li class="spacer"></li>
					<li>Sign Out</li>
				</ul>
			</div>
		</div>
	</div>
</mobile-view>
