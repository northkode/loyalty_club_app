<% for(var i=0; i< rc.length; i++){
	var _class = '';
	var event = rc[i];
%>

<div class="swiper-slide event-item">
	<% if(event.image) {%>
		<div class="image" style="background-image:url(<%= mobileApp.settings.imageURL + event.image_path %>)"> </div>
		<div class="event-content">
			<div class="event-title"><%= event.title %></div>
			<div class="event-date"><%= event.date %></div>
			<div class="event-description"><%= event.description %></div>
		</div>

	<%}%>
</div>

<% } %>
