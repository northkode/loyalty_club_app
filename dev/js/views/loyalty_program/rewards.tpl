<%
var rewards = rc.rewards;
for(var i=0; i < rewards.length; i++){
%>
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
