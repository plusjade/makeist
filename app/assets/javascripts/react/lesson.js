var Lesson = React.createClass({
    displayName: 'Lesson'
    ,
    getDefaultProps: function() {
        return {
            lesson : {}
        };
    }
    ,
    render: function() {
        var tabs = [];
        tabs.push({
            name: 'Materials',
            content : function() { return Materials },
            namespace: 'materials',
            async : function(props) {
                return '/lessons/' + props.lesson.id + '/materials'
            }
        });

        switch(MK.USER.type) {
            case 'Student':
                tabs.push({
                    name: 'My Feedback',
                    namespace: 'feedback',
                    content : function() { return Feedback },
                    async : function(props) {
                        return '/students/' + MK.USER.id + '/lessons/' + props.lesson.id + '/feedback'
                    }
                });
                break;
            case 'Teacher':
                tabs.push({
                    name: 'Feedback Data',
                    namespace: 'feedbacks',
                    content : function() { return FeedbackData },
                    async : function(props) {
                        return '/lessons/' + props.lesson.id + '/feedbacks'
                    }
                });
                break;
        };

        return React.DOM.div(null
                        , React.DOM.h3(null, 'Lesson ' + this.props.lesson.lesson + ' ' + this.props.lesson.date_human )
                        , SubTabs(_.extend({ tabs: tabs }, this.props))
                );
    }
});
Lesson = React.createFactory(Lesson);