<mobile-view class="profile_edit_page">
	<mobile-header title="Profile Edit" class='no-shadow'></mobile-header>
	<div class="content">
		<div class="change_profile_picture">
			<%
			var user_image = (mobileApp.currentUser.image == null) ? 'img/default_user_icon.png' : mobileApp.settings.imageURL + mobileApp.currentUser.user_image
			%>
				<profile-image image="<%= user_image%>"></profile-image>
				<input type="file" name="file" id="file" class="inputfile" />
				<label for="file" class="systemButton">Change Profile Picture</label>
		</div>
		<form>
			<div class="field">
				<input name="first_name" type="text" value="<%= mobileApp.currentUser.first_name %>" placeholder="First Name">
			</div>
			<div class="field">
				<input name="last_name" type="text" value="<%= mobileApp.currentUser.last_name %>" placeholder="Last Name">
			</div>
			<div class="field">
				<input name="username" type="text" value="<%= mobileApp.currentUser.username %>" placeholder="Email Address">
			</div>
			<div class="field birthday">
				<%
				var mth = mobileApp.currentUser.birthday.split('/')[0];
				var day = mobileApp.currentUser.birthday.split('/')[1];
				var year = mobileApp.currentUser.birthday.split('/')[2];
				%>
					<input type="tel" name="mth" placeholder="mth" value="<%=mth%>" /> /
					<input type="tel" name="day" placeholder="day" value="<%=day%>" /> /
					<input type="tel" name="year" placeholder="year" value="<%=year%>" />
			</div>
			<span>*This is used as a security question if you forget your password.</span>
			<div class="field" style="padding-bottom:15px;">
				<input name="password" type="password" placeholder="New Password">
			</div>
			<span>*Leave this blank if you wish to keep your existing password.</span>
		</form>
	</div>
	<button class="save-profile systemButton">Save Changes <div class="spinner"></div> </button>
</mobile-view>
