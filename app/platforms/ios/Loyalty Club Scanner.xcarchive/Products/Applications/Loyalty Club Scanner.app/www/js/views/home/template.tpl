<mobile-view class="page_welcome">
	<mobile-header title="" no-back class='no-shadow'></mobile-header>
	<div class="content">
		<div class="bg" style="background-image: url('img/bg.jpg');" style="opacity:.7"></div>

		<div class="header">
			<img src="./img/dashboard_logo.png">
			<div class="user-profile">
				<%
				var user_image = (mobileApp.currentUser.image == null) ? 'img/default_user_icon.png' : mobileApp.settings.imageURL + mobileApp.currentUser.user_image
				%>
					<profile-image image="<%= user_image %>" class="<%= (mobileApp.currentUser.image == null) ? 'empty' : '' %>"></profile-image>
					<h2><%= mobileApp.currentUser.first_name %> <%= mobileApp.currentUser.last_name %></h2>
					<p> <%= mobileApp.currentUser.username %></p>
			</div>
		</div>

		
		<div class="loyalty-cards">
			<h1>Loyalty Cards</h1>
			<% if(mobileApp.localSettings.getItem('program-tap-tip') == undefined) {%>
			<div class="tip"><span>Tip.</span> Tap a card to view details.</div>
			<%}%>
			<!-- Swiper -->
			<div class="swiper-container">
				<div class="swiper-wrapper"></div>
			</div>
			<div class="swiper-pagination"></div>
		</div>

		<div class="menu-wrapper">
			<div class="option-holder">
				<div class="option loyalty-program">
					<label class="systemButton ">Loyalty Programs</label>
				</div>
				<div class="option account-settings" style="border-left: 1px solid rgba(0, 0, 0, 0.47);">
					<label class="systemButton ">Account Settings</label>
				</div>
			</div>
		</div>
	</div>
</mobile-view>
