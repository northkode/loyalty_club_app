<%
var rewards = rc.rewards;
for(var i=0; i < rewards.length; i++){
%>
<<<<<<< HEAD
	<div class="reward">
		<div class="points <%= (Number(rc.points) > Number(rewards[i].cost)) ? '' : 'locked' %>">
			<i class="fa fa-lock"></i>
			<div class="amt">
				<%= rewards[i].cost %> <span>POINTS</span>
			</div>
		</div>
		<div class="title">
			<%= rewards[i].title %>
		</div>
	</div>

	<% } %>
=======
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
>>>>>>> b16cc2414337989a312ee81e4a8fe0c494f1e77f
