<mobile-view class="points_page">
	<mobile-header title="Account Code"></mobile-header>
	<div class="content">
		<p class="instruction">Show this QR code to the course representitive to earn your points.</p>
		<div class="bar_code">
			<img src="<%=mobileApp.settings.prod_server%><%=mobileApp.currentUser.bar_code %>">
			<p class="name">
				<%= mobileApp.currentUser.first_name %>
					<%= mobileApp.currentUser.last_name %>
			</p>
			<%
			if(cordova.platformId == 'ios') {
			%>
				<button class="passbook systemButton"><img src="img/wallet.png"></button>
			<%}%>
		</div>
			<div class="referral_code">
				Referral Code:
				<%= mobileApp.currentUser.referral_code %>
			</div>
	</div>
</mobile-view>
