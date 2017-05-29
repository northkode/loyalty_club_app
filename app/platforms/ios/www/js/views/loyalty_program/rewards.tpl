<%
var rewards = rc.rewards;
for(var i=0; i < rewards.length; i++){
%>
<div class="swiper-slide">
	<div class="image" style="background-image:url(<%= mobileApp.settings.imageURL + '/customers/'+rc.customerId +'/'+ rewards[i].image_path %>)"> </div>
	<div class="title"  >
		<%= rewards[i].title %>
	</div>
	<div class="points"  style="pont-size: 14px">
		<%= rewards[i].costs %> pts
	</div>
</div>

<% } %>
