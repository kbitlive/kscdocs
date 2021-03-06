require(["gitbook", "jQuery"], function(gitbook, $) {
    function selectElementText(el) {
        var range = document.createRange();
        range.selectNodeContents(el);
        var selection = window.getSelection();
        selection.removeAllRanges();
        selection.addRange(range);
    }

    function getSelectedText() {
        var t = '';
        if (window.getSelection) {
            t = window.getSelection();
        } else if (document.getSelection) {
            t = document.getSelection();
        } else if (document.selection) {
            t = document.selection.createRange().text;
        }
        return t;
    }

    function copyToClipboard(text) {
        if (window.clipboardData && window.clipboardData.setData) {
            return clipboardData.setData("Text", text);

        } else if (document.queryCommandSupported && document.queryCommandSupported("copy")) {
            var textarea = document.createElement("textarea");
            textarea.textContent = text;
            textarea.style.position = "fixed"; 
            document.body.appendChild(textarea);
            textarea.select();
            try {
                return document.execCommand("copy"); 
            } catch (ex) {
                console.warn("Copy to clipboard failed.", ex);
                return false;
            } finally {
                document.body.removeChild(textarea);
            }
        }
    }

    function expand(chapter) {
        chapter.show();
        if (chapter.parent().attr('class') != 'summary' &&
            chapter.parent().attr('class') != 'book-summary' &&
            chapter.length != 0
        ) {
            expand(chapter.parent());
        }
    }

    gitbook.events.bind("page.change", function() {
        $("pre").each(function() {
            $(this).css("position", "relative");

            var $copyCodeButton = $("<span class='copy-code-button'>复制代码</span>");
            $copyCodeButton.click(function() {
                var $codeContainer = $(this).siblings("code");
                if ($codeContainer) {
                    selectElementText($codeContainer.get(0));
                    var selectedText = getSelectedText();

                    var buttonNewText = "";
                    if (copyToClipboard(selectedText) == true) {
                        buttonNewText = "复制成功";
                        selectElementText($codeContainer.get(0));
                    } else {
                        buttonNewText = "复制失败";
                        selectElementText($codeContainer.get(0));
                    }

                    $(this).text(buttonNewText);
                    var that = this;
                    setTimeout(function() {
                        $(that).text("复制代码");
                    }, 2000);
                }
            });

            $(this).append($copyCodeButton);
        });

        $(".secNavLink").removeAttr('href');
        $(".secNavLink").click(function(){
            $('.list-group-item').removeClass('active');
            $('.list-group-item').removeClass('active-level');
            $('.list-group-item .articles').removeAttr('style');
            $(this).parent('.list-group-item').addClass('active');
            $('.arrow').removeClass('arrow-up').addClass('arrow-down');
            $(this).find('.arrow').removeClass('arrow-down').addClass('arrow-up');
            return false;
        });
    });
});