var AsyncLoader = React.createClass({
    displayName: 'AsyncLoader'
    ,
    propTypes : {
        content : React.PropTypes.func.isRequired
        ,
        async : React.PropTypes.oneOfType([
                    React.PropTypes.string.isRequired,
                    React.PropTypes.func.isRequired
                ])
        ,
        handleResponse : React.PropTypes.func.isRequired
        ,
        loading : React.PropTypes.func.isRequired
        ,
        error : React.PropTypes.func.isRequired
        ,
        wrapContent : React.PropTypes.func
        ,
        payload : React.PropTypes.object
    }
    ,
    // payload must be cleared on mount initialization to ensure loading UI is shown.
    // Note this leverages React Lifecycle behavior: uniquely keyed components only mount once.
    // When fetch() finishes, it triggers an update to the _same_ component.
    // When a differently keyed component (page) is displayed, 
    // the existing page is un-mounted and the new one is mounted.
    componentWillMount : function() {
        var payload = this.props.payload;
        this.props.payload = null;
        this.fetch(payload);
    }
    ,
    render : function() {
        var primary, payload, status;
        status = this.props.payload ? this.props.payload.status : 'loading';

        switch (status) {
            case 'success':
                primary = this.props.content(this.props.payload);
                break;

            case 'error':
                primary = this.props.error(this.props.payload);
                break;

            default: // loading
                primary = this.props.loading(this.props.payload);
        }

        return this.props.wrapContent ? this.props.wrapContent(primary) : primary;
    }
    ,
    // Asynchronously fetch the payload.
    // This will populate the 'payload' attribute on the parent component.
    fetch : function(payload) {
        if(typeof this.props.async === 'function') {
            this.props.async(this.props.handleResponse);
        }
        else if(this.props.endpoint) {
            var endpoint = typeof this.props.endpoint === 'function'
                                ? this.props.endpoint(payload)
                                : this.props.endpoint

            var handleResponse = this.props.handleResponse;
            $.ajax({
                url: endpoint,
                dataType: "JSON"
            })
            .done(function(rsp) {
                handleResponse(_.extend({ status: 'success' }, rsp));
            })
            .error(function(xhr) {
                handleResponse({
                    status: xhr.status,
                    status: 'error',
                    error: xhr.statusText
                });
            })
        }
    }
});
AsyncLoader = React.createFactory(AsyncLoader);
