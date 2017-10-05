<mobile-view class="reward-page">
	<mobile-header title="<%= rc.reward.title %>"></mobile-header>
	<div class="content">
		<div class="scroller">
			<div class="header" style="background-image:url(<%= mobileApp.settings.imageURL + 'customers/'+ rc.customerId + '/' + rc.reward.image_path %>)">
				<div class="details">
					<h3><%= rc.reward.title %></h3>
					<p class="description"><%= rc.reward.description %></p>

					<div class="cost">
						<%= rc.reward.cost %> <span>pts</span>
					</div>
				</div>
			</div>
		</div>
		<% if( rc.points >= rc.reward.cost ) {%>
		<div class="redeem-btn systemButton">
			Redeem Reward
		</div>
		<% } %>
	</div>
</mobile-view>
