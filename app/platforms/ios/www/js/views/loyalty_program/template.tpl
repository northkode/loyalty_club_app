<mobile-view class="program-page">
	<mobile-header></mobile-header>
	<div class="content">

		<div class="header" style="background-image:url(<%= mobileApp.settings.imageURL + rc.image_path %>)">
			<% if(rc.has_logo) { %>
			<div class="logo" >
				<img src="<%= mobileApp.settings.imageURL + rc.logo_path %>" />
			</div>
			<%}%>
			<div class="details" style="<%= (!rc.has_logo) ? 'margin-top:auto': '' %>" >
				<h3><%= rc.name %></h3>
				<p class="address">
					<%= rc.address %>
				</p>
				<p class="phone">
					<%= rc.phone.replace(/\(?(\d{3})\)?[- ]?(\d{3})[- ]?(\d{4})/g,'$1 $2-$3') %>
				</p>
			</div>
			<button class="systemButton join-program">Join Program</button>
		</div>

		<div class="rewards">
			<h1>Loyalty Rewards</h1>
			<div class="swiper-pagination"></div>
			<!-- Swiper -->
			<div class="swiper-container">
				<div class="swiper-wrapper"></div>
			</div>
		</div>


	</div>
</mobile-view>
