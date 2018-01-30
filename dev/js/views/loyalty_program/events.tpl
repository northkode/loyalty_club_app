<%
var events = rc.events;
for(var i=0; i < events.length; i++){
	var event = events[i];
%>
	<div class="event" data-id="<%= event.id %>" style="background-image:url(<%= mobileApp.settings.imageURL + 'customers/'+ rc.customerId + '/' + event.image_path %>)">
		<div class="event-title"><%= event.title %></div>
		<div class="event-description"><%= event.description %></div>
        <% if (event.date) {%>
		<div class="event-date"><%= event.date %></div>
        <%}%>
	</div>

<% } %>
