TechLib.populateArticleList = function(volume, issue, listObj) {

    if (listObj == null) { listObj = TechLib.dialog.top.right.articles; }

    listObj.window.removeAll();

    try {

        var list = TechLib.getArticleList(volume, issue).articles;

        // sort the articles by section
        list.sort(function(a, b) {
            return a['section'].localeCompare(b['section']);
        });

        for (var i = 0; i < list.length; i++) {
            var row = listObj.window.add('item', list[i].headline);
            row.subItems[0].text = list[i].section;
            row.subItems[1].text = list[i].slug;
            row.subItems[2].text = list[i].id;
        }

    } catch (error) {

        // the response could be wrong (not json)
        // in that case it's ok to just leave the list empty
        alert("Malformed response received\n" + error);

    }

}

TechLib.checkoutPopup = function() {

    var styling = {
        topRow: {
            size: [1000, 450]
        },

        articleList: {
            size: [850, 400],
            alignment: ['fill', 'fill']
        },

        leftColumn: {
            size: [100, 400],
            'justify': 'left',
            alignment: ['left', 'fill']
        },

        buttons: {
            alignment: ['right', 'bottom']
        },

        smallInput: {
            size: [80, 20],
            'alignment': 'left'
        },

        alignLeft: {
            'alignment': 'left'
        },
    }

    // layout
    TechLib.dialog = new TechLib.ui.Palette({resizeable: true}).with(styling);
    dialog = TechLib.dialog;
    dialog.window = new Window('palette', 'Check Out', undefined, {resizeable: true});
    dialog.window.onResizing = dialog.window.onResize = function () {this.layout.resize();}

    dialog.text('Text', 'Choose the article you want to check out');
    var top = dialog.row('top').using('topRow');

    top.column('left').using('leftColumn');
    top.left.text('volume_label', 'Volume').using('alignLeft');
    top.left.input('volume', TechLib.DEFAULT_VOLUME).using('smallInput');

    top.left.text('issue_label', 'Issue').using('alignLeft');
    top.left.input('issue', TechLib.DEFAULT_ISSUE).using('smallInput');

    top.left.button('load', 'Load articles');

    top.left.text('checkout_label', 'Check out').using('alignLeft');
    var checkboxes = []
    for (var i = 0; i < TechLib.ARTICLE_PARTS.length; i++) {
        var cb = top.left.window.add('checkbox', undefined, TechLib.ARTICLE_PARTS[i]);
        cb.value = (TechLib.ARTICLE_PARTS[i] in TechLib.ARTICLE_PARTS_DEFAULT);
        cb.alignment = 'left';
        checkboxes.push(cb);
    }

    top.column('right');
    var listObj = top.right.list('articles', ['Title', 'Section', 'Slug', 'Id']).using('articleList');

    TechLib.populateArticleList(TechLib.DEFAULT_VOLUME, TechLib.DEFAULT_ISSUE, listObj);

    dialog.row('buttons', '');
    dialog.buttons.button('no', 'Close');
    dialog.buttons.button('ok', 'Check out');
    var status_label = dialog.buttons.window.add('statictext', undefined, '');
    status_label.minimumSize.width = 150;

    // define the article list reloading callback
    var articleListParamCallback = function() {
        // check inputs and reload the list
        var vol = top.left.volume.text;
        var issue = top.left.issue.text;
        if (!TechLib.isInt(vol) || !TechLib.isInt(issue)) {

            alert('The numbers must be integers');

            top.left.volume.text = parseInt(vol);
            top.left.issue.text = parseInt(issue);

        }

        vol = parseInt(vol);
        issue = parseInt(issue);

        TechLib.DEFAULT_VOLUME = vol;
        TechLib.DEFAULT_ISSUE = issue;
        TechLib.populateArticleList(vol, issue, listObj);
    }

    // add the callback to the load button click
    top.left.load.on('click').do(articleListParamCallback);

    // add the callback to Enter press while in the input fields
    var inputs = [top.left.volume.window, top.left.issue.window];
    _.each(inputs, function(input) {
        input.addEventListener('keydown', function(e) {
            if (e.keyIdentifier === 'Enter' ||
                // apparently the numpad enter key is undefined
                typeof e.keyIdentifier === 'undefined') {
                articleListParamCallback();
            }
        });
    });

    // close window callback
    dialog.buttons.no.onClick = function(){
        this.window.close();
    }

    // load article callback
    var loadArticleCallback = function(){
        if (TechLib.syncing) {
            return;
        }
        // check if an article is selected
        var sel = listObj.window.selection;

        // get the list of selected checkboxes in csv
        var parts_csv = _.reduce(checkboxes, function(acc, val) {
                if (val.value) {
                    if (acc.length != '') { return acc+','+val.text; }
                    else { return val.text; }
                } else {
                    return acc;
                }
            }, '');

        if (sel == null) {
            alert('You must select an article to check out');
        } else if (parts_csv === '') {
            alert('You must select at least one part of the article to synchronize');
        } else {
            status_label.text = 'Downloading...';
            status_label.hide();
            status_label.show();
            TechLib.syncing = true;
            TechLib.doCheckout(
                listObj.window.selection.subItems[2].text,
                parts_csv,
                listObj.window.selection.subItems[1].text,
                status_label,
                function() {
                  TechLib.syncing = false;
            });
        }
    }

    dialog.buttons.ok.onClick = loadArticleCallback;
    listObj.window.onDoubleClick = loadArticleCallback;

    dialog.window.show();

}
