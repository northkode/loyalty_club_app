<mobile-view class="page_welcome">
	<mobile-header title="" no-back class='no-shadow'></mobile-header>
	<div class="content">

		<div class="header" style="background-image: url('img/main_image.jpg');">
			<img src="./img/dashboard_logo.png">
		</div>

		<div class="points" style="<%= ((mobileApp.currentUser.points != 0) ? 'bottom:20%' : '') %>">
			<div class="user-profile">
				<%
				var user_image = (mobileApp.currentUser.image == null) ? 'img/default_user_icon.png' : mobileApp.settings.imageURL + mobileApp.currentUser.user_image
				%>
					<profile-image image="<%= user_image %>" class="<%= (mobileApp.currentUser.image == null) ? 'empty' : '' %>"></profile-image>
					<h2><%= mobileApp.currentUser.first_name %> <%= mobileApp.currentUser.last_name %></h2>
					<% if(mobileApp.currentUser.points != 0) { %>
						<p>your loyalty points</p>
					<% } %>
			</div>
			<%
			if(mobileApp.currentUser.points != 0) {
				var points = mobileApp.currentUser.points.toFixed(0).replace(/./g, function(c, i, a) { return i && c !== "." && ((a.length - i) % 3 === 0) ? ',' + c : c; });
			%>
				<div class="points_text">
					<span class='text'><%= points %></span>
					<span class='bg'><%= points %></span>
				</div>
				<%}%>
					<div class="buttons">
						<button class="earn_points systemButton">Earn Points</button>
						<button class="redeem_points systemButton">Redeem Points</button>
					</div>

		</div>

		<div class="menu-wrapper">
			<div class="option-holder">
				<div class="option" ui-href="http://www.theranchgolf.com/?/golf-course/">
					<span class="img systemButton icon course" style="background-image: url('img/icons.png');"></span>
					<label>Golf Course</label>
				</div>
				<div class="option events">
					<span class="img systemButton icon events" style="background-image: url('img/icons.png');"></span>
					<label>Special Events</label>
				</div>
				<div class="option" ui-href="http://www.carmadirect.com/courses.aspx?x=14">
					<span class="img systemButton icon tee-time" style="background-image: url('img/icons.png');"></span>
					<label>Book Tee Time</label>
				</div>
			</div>

		</div>
	</div>

	<div class="onboarding">
		<div class="welcome">
			<h2>Welcome to</h2>
			<h1>The Ranch Golf and Country Club</h1>
			<h2 style="color: rgb(255, 186, 6);font-style: italic;">Loyalty Program.</h2>
			<p style="margin-top: 60px;width:80%;font-size:13px">
				Swipe through this short introduction to see how the app works!
			</p>
			<button class="start systemButton">Get Started</button>
		</div>

		<div class="slides">
			<div class="swiper-container">
				<div class="swiper-wrapper">
					<div class="swiper-slide" style="background-image:url(img/onboarding/1.jpg)">
						<p><strong>Dashboard</strong><br/>Watch your loyalty points grow as you play!<br/><br/>To manage your user account, click the profile picture to edit your account settings.</p>
					</div>
					<div class="swiper-slide" style="background-image:url(img/onboarding/2.jpg)">
						<p><strong>Earn Rewards</strong><br/>This is your custom QR code. Course representives scan this to reward you with points on your course purchases.<br/><br/>Share your referral code with your friends to earn more points!</p>
					</div>
					<div class="swiper-slide" style="background-image:url(img/onboarding/3.jpg)">
						<p><strong>Redeem Points</strong><br/>All the available rewards will be listed here.<br/><br>Click redeem in front of a course representitive to get your rewards. </p>
					</div>
					<div class="swiper-slide" style="background-image:url(img/onboarding/4.jpg)">
						<p><strong>Profile</strong><br/>Shows your public profile and user email address.<br/><br/>Click edit to change your details at any time.</p>
					</div>
					<% if(cordova.platformId == 'ios') {%>
					<div class="swiper-slide" style="background-image:url(img/onboarding/5.jpg)">
						<p><strong>Push Notifications</strong><br/><br/>We send out special announcements of bonus points, rewards, tournament info and more. Please agree to apple pushes so you dont miss out!</p>
						<button class="push-agree systemButton">I Agree</button>
					</div>
					<%}%>
					<div class="swiper-slide" style="padding-top:60%">
						<p><strong>Complete</strong><br/><br/>Start earning points today!</p>
						<button class="finish systemButton">Finish</button>
					</div>

				</div>
				<!-- Add Pagination -->
				<div class="swiper-pagination"></div>
			</div>
		</div>
	</div>
</mobile-view>
