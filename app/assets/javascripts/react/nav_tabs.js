var NavTabs = React.createClass({
    displayName: 'NavTabs'
    ,
    mixins : [ContentMixin]
    ,
    getInitialState: function() {
        return { active : 0 };
    }
    ,
    render: function() {
        var tabs = [], active, primary;
        this.props.tabs.forEach(function(d, i) {
            tabs.push(React.DOM.li(
                        {
                            key: d.name,
                            className: (this.state.active === i ? 'active' : null),
                            onClick : this.setTab.bind(this, i)
                        }
                        , d.name
                   ));
        }, this);

        if(this.props.tabs.length > 0 && this.state.active > -1) {
            active = this.props.tabs[this.state.active];

            switch (this.state.status) {
                case 'success':
                    primary = active.content
                                ? active.content(this.state.content)
                                : active.name
                    ;
                    break;
                case 'error':
                    primary = this.wrapContent(StatusMessage.error(this.state.content));
                    break;
                case 'loading':
                    primary = this.wrapContent(StatusMessage.loading());
            }
        }

        return React.DOM.div(null
                , React.DOM.div({ className: 'primary-navigation' }
                    , React.DOM.div({ id: 'heading' }
                        , React.DOM.a({ href: '/' }, this.props.courseName)
                    )
                    , React.DOM.ul({ className: 'nav-tabs' }, tabs)
                )
                , primary
            );
    }
    ,
    // Set viewable Tab
    // @param [Integer] i - The tab's index
    setTab : function(i) {
        if(this.props.tabs[i].async) {
            if(typeof this.props.tabs[i].async === 'function') {
                this.setState({
                    active: i,
                    content: this.props.tabs[i].async()
                });
            }
            else {
                var self = this, state = { status: 'loading', active: i };
                this.setState(state);

                $.ajax({
                    url: this.props.tabs[i].async,
                    dataType: "JSON"
                })
                .done(function(rsp) {
                    self.setState({
                        status: 'success',
                        content: rsp
                    });
                })
                .error(function(xhr) {
                    self.setState({
                        status: 'error',
                        content: {
                            status: xhr.status,
                            error: xhr.statusText
                        }
                    });
                })
            }
        }
        else {
            this.setState({ active : i });
        }
    }
});
NavTabs = React.createFactory(NavTabs);
