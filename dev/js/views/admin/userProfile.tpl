<div class="user-profile jelly-animation" data-id="<%= rc.user.id %>">
	<div class="close systemButton"><i class="fa fa-times-circle"></i></div>
	<div class="header">
		<div class="profile-image-holder landscape ">
			<!--<div class="profile-image" style="background-image:url(<%= rc.user.user_image %>)"> </div>-->
			<div class="details">
				<div class="name">
					<%= rc.user.first_name%> <%= rc.user.last_name%>
				</div>
				<div class="company_name">
					<%= rc.user.username %>
				</div>
			</div>
		</div>
	</div>
	<form>
		<p style="margin-bottom:0;">Specify the type of purchase:</p>
		<input type="hidden" name="user_id" value="<%= rc.user.id %>"/>
		<input type="hidden" name="company_id" value="<%= mobileApp.currentUser.customer.id %>"/>
		<div class="options">
			<% for(var i=0; i < rc.options.length; i++) { %>
				<div class="option <%= rc.options.length == 1 ? 'active' : '' %>" data-id="<%= rc.options[i].id %>" data-fraction="<%= rc.options[i].fraction %>">
					<label for="<%= rc.options[i].id%>">
						<span><%= rc.options[i].label %></span>
					</label>
				</div>
				<% } %>
		</div>

		<div class="price">
			<p>Price of Purchase:</p>
			<input type="tel" name="amt">
		</div>
	</form>
	<button class="systemButton submit"> Submit <div class="spinner"></div> </button>
</div>
