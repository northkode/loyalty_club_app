<mobile-view class="categories-page">
	<mobile-header title="Loyalty Programs"></mobile-header>
	<div class="content">
		<%
		for(var i=0; i < mobileApp.categories.length; i++){
		    var category = mobileApp.categories[i];
		%>
		<div class="category " style="background-image:url(<%= mobileApp.settings.imageURL + category.image %>)" data-id="<%= category.id %>">
		    <div class="info systemButton">
		        <h1><%= category.label %></h1>
		    </div>
		</div>
		<%}%>

	</div>
</mobile-view>
