<%
var cards = rc.cards;
for(var i=0; i < cards.length; i++){
%>
	<div class="swiper-slide" data-customer-id="<%= cards[i].id%>">
		<div class="flipper">
			<div class="front">
				<div class="image" style="background-image:url(<%= mobileApp.settings.imageURL + cards[i].image_path %>)"> </div>
				<div class="title">
					<%= cards[i].name %>
				</div>
				<div class="points">
					<span><%= cards[i].points %></span> pts
				</div>
			</div>
			<div class="back">
				<i class="fa fa-times systemButton"></i>
				
			</div>
		</div>
	</div>

<% } %>
