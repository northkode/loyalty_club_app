<div class="profile-image-holder <%= rc.layout %> <%= ((rc.showRating) ? 'hasRating' : '' ) %>">
    <div class="profile-image" style="background-image:url(<%=rc.image %>)"> </div>
    <%
    if(!rc.noLabel){
    %>
        <%
            if(rc.showRating){
        %>
        <div class="name-holder">
            <div class="name"><%= rc.name %></div>
			<% if(rc.company){ %>
	        <div class="company_name"><%=rc.company%></div>
	        <%}%>
			<% if(rc.location){ %>
	        <div class="company_location"><%=rc.location%></div>
	        <%}%>
            <user-rating value="<%= rc.ratingValue %>" no-count></user-rating>

        </div>
        <%
            } else {
         %>
        <% if(rc.company){ %>
        <div class="company_name"><%=rc.company%></div>
        <%}%>
		<% if(rc.name){ %>
        <div class="name"><%= rc.name %></div>
		<%}%>
        <% if(rc.location){ %>
        <div class="company_location"><%=rc.location%></div>
        <%}%>
        <%
            }
        %>
    <%}%>
</div>
