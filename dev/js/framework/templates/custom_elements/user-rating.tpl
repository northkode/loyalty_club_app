<div class="rating">
    <%
        for(var i=1;i<=5;i++){
    %>
    <i class="<%=(i <= rc.value) ? 'fa fa-star' : 'fa fa-star-o' %>"></i>
    <%}%>
    <%
    if(rc.noCount == undefined){
    %>
    <span>(<%=rc.reviews%>)</span>
    <%}%>
</div>