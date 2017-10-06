<mobile-view class="admin_page">
	<div class="content">
		<% if(mobileApp.currentUser.account_type == 'admin') {%>
		<button class="switch">Switch To Points</button>
		<% } %>
		<button class="cancelScan systemButton"> Cancel </button>
		<button class="restartScan systemButton"> Restart Scan </button>
		<% if(mobileApp.currentUser.customer.has_logo) { %>
		<div class="logo">
			<img src="https://loyaltyclub.loyaltyapp.org/uploads/<%= mobileApp.currentUser.customer.logo_path%>">
			<div>Logged in as: <%= mobileApp.currentUser.full_name%></div>
		</div>
		<%}%>
		<h2><%= mobileApp.currentUser.customer.name %></h2>
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
