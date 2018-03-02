<%
for(var i=0; i < rc.categories.length; i++){
    var category = rc.categories[i];
%>
<div class="category " style="background-image:url(<%= category.image %>)" data-id="<%= category.id %>">
    <div class="info systemButton">
        <h1><%= category.label %></h1>
    </div>
</div>
<%}%>
