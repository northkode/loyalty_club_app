<mobile-view class="program-page">
	<mobile-header title="<%=rc.name%>" icon="<%= ((rc.enrolled == true) ? './img/qr_icon.png' : '') %>"></mobile-header>
	<div class="content <%= ((rc.enrolled == true) ? 'enrolled' : '') %>">
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
							<% if(rc.enrolled == true) {%>
								<p class="phone">
									<%= rc.customer.points %> Points to Spend
								</p>
								<%}%>
						</div>
						<% if(rc.enrolled == true) { %>
							<!--<img class="bar-code" src="<%=mobileApp.settings.prod_server%><%=mobileApp.currentUser.bar_code %>">-->
							<% } %>
			</div>

			<div class="tabbar flex-none">
				<div class="tabbar__tab active" data-ui-href="rewards">Rewards</div>
				<div class="tabbar__tab" data-ui-href="activity">Activity</div>
				<div class="tabbar__tab" data-ui-href="details">Details</div>
			</div>
			<div class="tab__content active" data-id="rewards">
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
						<% if(rc.enrolled) { %>
							<p>Member Since
								<%= rc.customer.joined %>
							</p>
							<%}%>
					</div>
					<ul class="activity-details">
						<li class='option'>
							<span> <%= (rc.enrolled) ? rc.customer.points : 0  %> </span>
							<div class="label">Current Points</div>
						</li>
						<li class='option'>
							<span> <%= (rc.enrolled) ? rc.customer.redemptions : 0  %> </span>
							<div class="label">Reward Redemptions</div>
						</li>
					</ul>
				</div>
			</div>
			<div class="tab__content" data-id="details">
				<h2>Business Information</h2>
				<ul class="details-holder">
					<li class='address option'>
						<i class="fa fa-map-marker"></i>
						<%= rc.address %>
					</li>
					<li class='phone option'>
						<i class="fa fa-phone"></i>
						<%= rc.phone.replace(/\(?(\d{3})\)?[- ]?(\d{3})[- ]?(\d{4})/g,'$1 $2-$3') %>
					</li>
					<% if(rc.website) {%>
						<li class='website option'>
							<i class="fa fa-globe"></i>
							<%= rc.website %>
						</li>
						<%}%>
							<% if(rc.facebook_url) {%>
								<li class='facebook option'>
									<i class="fa fa-facebook"></i> /
									<%= rc.facebook_url %>
								</li>
								<%}%>
				</ul>
				<% if(rc.enrolled == true) { %>
					<div class="leave-program">
						<span>Leave Rewards Program</span>
					</div>
					<%}%>
			</div>
		</div>
	</div>
	<% if(rc.enrolled == undefined) { %>
		<button class="systemButton join-program">Join Program</button>
		<%}%>
</mobile-view>
