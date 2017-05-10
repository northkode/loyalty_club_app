<mobile-view class="admin_page">
	<div class="content">
		<% if(mobileApp.currentUser.account_type == 'admin') {%>
		<button class="switch">Switch To Points</button>
		<% } %>
		<button class="cancelScan systemButton"> Cancel </button>
		<button class="restartScan systemButton"> Restart Scan </button>
		<div class="logo">
			<img src="img/main_logo.png">
			<div>Logged in as: <%= mobileApp.currentUser.first_name%> <%= mobileApp.currentUser.last_name%></div>
		</div>
		<div class="scan systemButton">
			<img src="img/Scan_Code.png">
		</div>
		<div class="scanning">
			<img src="img/scanning_icon.png">
		</div>
		<div class="logout systemButton">
			Logout
		</div>
	</div>
</mobile-view>
