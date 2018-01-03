<mobile-view class="program-page">
	<mobile-header title="<%=rc.name%>" icon="<%= ((rc.customer) ? './img/qr_icon.png' : '') %>"></mobile-header>
	<div class="content <%= ((rc.customer) ? 'enrolled' : '') %>">
		<div class="scroller">
			<div class="header" style="<%= ((rc.has_logo) ? '' : 'padding-top:90px;' ) %> background-image:url(<%= mobileApp.settings.imageURL + rc.image_path %>)">
				<% if(rc.has_logo) { %>
					<div class="logo">
						<img src="<%= mobileApp.settings.imageURL + rc.logo_path %>" />
					</div>
					<% } %>
						<div class="details">
							<h3><%= rc.name %></h3>
							<p class="address">
								<%= rc.categories.label %>
							</p>
							<% if(rc.customer) {%>
								<p class="phone">
									<%= rc.customer.points %> Points to Spend
								</p>
								<%}%>
						</div>

			</div>

			<div class="tabbar flex-none">
				<div class="tabbar__tab active" data-ui-href="rewards">Rewards</div>
				<div class="tabbar__tab" data-ui-href="activity">Activity</div>
				<div class="tabbar__tab" data-ui-href="details">Details</div>
			</div>
			<div class="tab__content active" data-id="rewards" style="position:relative">
				<div class="spinner" style="margin-top:30px;"></div>
				<div class="rewards">
					<div class="rewards-header"></div>
					<div class="rewards-swiper">
					</div>
				</div>
			</div>
			<div class="tab__content" data-id="activity">
				<div class="activity">
					<div class="activity-header">
						<h2>Your History</h2>
						<span flex></span>
						<% if(rc.customer) { %>
							<p>Member Since
							<%= rc.customer.joined %>
							</p>
						<%}%>
					</div>
					<ul class="activity-details">
						<li class='option'>
							<span> <%= (rc.customer) ? rc.customer.points : 0  %> </span>
							<div class="label">Current Points</div>
						</li>
						<li class='option'>
							<span> <%= (rc.customer) ? rc.customer.redemptions : 0  %> </span>
							<div class="label">Reward Redemptions</div>
						</li>
					</ul>
				</div>
			</div>
			<div class="tab__content" data-id="details">
				<h2>Business Information</h2>
				<ul class="details-holder">
					<a href="http://maps.google.com/?q=<%= rc.address %>" target="_blank">
						<li class='address option'>
							<i class="fa fa-map-marker"></i>
							<%= rc.address %>
						</li>
					</a>
					<a href="tel:<%= rc.phone.replace(/\(?(\d{3})\)?[- ]?(\d{3})[- ]?(\d{4})/g,'$1 $2-$3') %>">
						<li class='phone option'>
							<i class="fa fa-phone"></i>
							<%= rc.phone.replace(/\(?(\d{3})\)?[- ]?(\d{3})[- ]?(\d{4})/g,'$1 $2-$3') %>
						</li>
					</a>
					<% if(rc.website) {%>
						<a href="<%= rc.website %>" target="_blank">
							<li class='website option'>
								<i class="fa fa-globe"></i>
								<%= rc.website %>
							</li>
						</a>
						<%}%>
						<% if(rc.facebook_url) {%>
							<a href="https://facebook.com/<%= rc.facebook_url %>" target="_blank">
								<li class='facebook option'>
									<i class="fa fa-facebook"></i> /
									<%= rc.facebook_url %>
								</li>
							</a>
						<%}%>
						<% if(rc.online_booking_url) {%>
							<a href="<%= rc.online_booking_url %>" target="_blank">
								<li class='bookonline option'>
									<i class="fa fa-flag"></i>
									Click here to book online
								</li>
							</a>
						<%}%>
				</ul>
				<% if(rc.customer) { %>
					<div class="leave-program">
						<span>Leave Rewards Program</span>
					</div>
					<%}%>
			</div>
		</div>
	</div>
	<% if(!rc.customer) { %>
		<button class="systemButton join-program">Join Program</button>
		<%}%>
</mobile-view>
