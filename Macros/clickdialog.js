(function () {
	var clickCount = 0;
	Macro.add("clickdialog", {
		skipArgs: false,
		tags: ["whenclosed", "/clickdialog"],
		handler: function() { 
			var args = this.args;

			// Do some simple error processing
			if (args.length < 2) {
				return this.error("clickdialog missing selector and/or title");
			}

			// Extract the arguments and contents of the macros
			var dialogSelector = args[0];
			var dialogTitle = args[1];
			var dialogContents = this.payload[0].contents;
			var dialogClasses = (args.length >= 3) ? args[2] : "";
			var dialogCloseContents = null;
			if (this.payload[1]) {
				dialogCloseContents = this.payload[1].contents;
			}
			var taskName = "clickdialog-" + clickCount++;

			// Set up a task to run when the page has displayed
			postdisplay[taskName] = function() {
				var dialogElement;

				var startFunction = function() {
					dialogElement = Dialog.setup(dialogTitle, dialogClasses);
					$(dialogElement).parent()
						.find("#ui-dialog-titlebar")
						.addClass(dialogClasses)
					Dialog.wiki(dialogContents);
				}.bind(this);

				var closeFunction = function() {
					if (dialogCloseContents) {
						new Wikifier(this.output, dialogCloseContents);
					}
					$(dialogElement).parent()
						.find("#ui-dialog-titlebar")
						.removeClass(dialogClasses)
				}.bind(this);
				
				Dialog.addClickHandler(dialogSelector, null, startFunction, 
					null, closeFunction);
			}.bind(this);
		}
	});
})();