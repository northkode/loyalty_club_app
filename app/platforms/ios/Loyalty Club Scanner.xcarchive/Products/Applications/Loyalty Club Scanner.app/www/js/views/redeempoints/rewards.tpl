<% for(var i=0; i< rc.length; i++){
	var _class = '';
%>
	<% if(mobileApp.currentUser.points <= rc[i].cost) { _class = 'lock'; } %>
		<div class="swiper-slide <%= _class %>">
			<div class="flipper" >
				<div class="front" style="background-image:url(<%= mobileApp.settings.imageURL + rc[i].image_path %>)">
					<% if(rc[i].show_title == 1){ %>
					<div class="title <%= rc[i].color %>"  >
						<%= rc[i].title %>
					</div>
					<%}%>
					<div class="footer">
						<p><%= rc[i].cost %> pts</p>
						<% if(_class != 'lock') { %>
						<div class="redeem_btn systemButton <%= rc[i].color %>">Redeem Reward</div>
						<%} else { %>
						<div class="redeem_btn lock systemButton <%= rc[i].color %>"> <img src="img/lock.png"> </div>
						<%}%>
					</div>
				</div>
				<div class="back">
					<i class="fa fa-times systemButton"></i>
					<p class="description"><%= rc[i].description %></p>
					<button class="confirm systemButton" data-id="<%= rc[i].id %>">Confirm <div class="spinner"></div></button>
					<p class="disclaimer">Make sure to let a course representitive see you redeem this reward</p>
				</div>
			</div>
		</div>
<% } %>
