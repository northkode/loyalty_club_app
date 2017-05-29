<mobile-view class="customer-page">
	<mobile-header title="<%= rc.category.label %>"></mobile-header>
	<div class="extended-header">
		<p class="title">All Regions</p>
	</div>
	<div class="content">

		<ul class="customers">
			<%
			for(var i=0; i < rc.category.customers.length; i++){
				var customer = rc.category.customers[i];
			%>
				<li class="customer systemButton" data-id="<%= customer.id %>">
					<div class="image" style="background-image:url(<%= mobileApp.settings.imageURL + customer.image_path %>)"></div>
					<div class="details">
						<h3 class="title"><%= customer.name %></h3>
						<div class="region">
							<%= customer.region %>
						</div>
					</div>
				</li>
				<%}%>
		</ul>

		<p>More loyalty Programs Coming Soon!</p>
	</div>
</mobile-view>
