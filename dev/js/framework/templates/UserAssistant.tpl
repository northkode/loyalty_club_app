<%
var slides = rc.slides;
var options = rc.options;
%>
<div class="off-screen-wrapper swoosh-up">
    <div class="user-assistant <%= (options.small) ? 'small' : '' %>">
        <%
        _.each(slides,function(slide){
        %>
        <div class="header">
            <%
            if(slide.img != undefined){
            %>
            <img src="<%=slide.img%>">
            <% }else{ %>
            <img src="img/assets/assistant.png">
            <%}%>
        </div>
        <div class="slides">
            <div class="slide">
                <div class="title"><%=slide.title%></div>
                <div class="message">
                    <%= slide.message %>
                </div>
                <div class="button_holder">
                    <%
                    if(!slide.buttonLabel.length) return;
                    var buttons = slide.buttonLabel.split(',');
                    if(buttons.length > 1){
                    for(var i=0; i < buttons.length; i++){
                    %>
                    <button class="systemButton"><%=buttons[i]%></button>
                    <%}%>
                    <% } else { %>
                    <button class="systemButton"><%=buttons[0]%></button>
                    <%}%>
                </div>

            </div>
        </div>
        <%
        });
        %>
    </div>
</div>
