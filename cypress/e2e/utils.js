// This is an invisible template tag for enabling syntax highlighting
// of any string in most editors.
export function html(strings) {
    return strings.raw[0]
}

/**
 * @param {string} name
 * @param {string} specName
 * @param {string} template
 * @param {function} [callback]
 * @param {string} [expectedError]
 */
export let test = function({name, specName, template, callback, expectedError}) {
    it(name, () => {
        cy.visit(`${__dirname}/${specName}`, {
            onBeforeLoad(win) {
                cy.stub(win.console, "warn").as("consoleWarn");
                cy.stub(win.console, "error").as("consoleError");
            }
        });

        if (expectedError) {
            cy.on("fail", ( error ) => {
                if (error.message.includes(expectedError)) {
                    return false
                }
                throw error
            });
        }

        cy.get("#root").then(([el]) => {
            el.innerHTML = template;

            cy.window().then(window => {
                // Execute all injected script tags.
                window.evalScripts();

                if (callback) {
                    callback(cy, window);
                }
            });
        });
    });
}

export let haveAttribute = (name, value) => el => expect(el).to.have.attr(name, value);
export let notHaveAttribute = (name, value) => el => expect(el).not.to.have.attr(name, value);
export let haveText = text => el => expect(el).to.have.text(text);
export let haveHtml = html => el => expect(el).to.have.html(html);
export let haveClasses = classes => el => classes.forEach(aClass => expect(el).to.have.class(aClass));
export let notHaveClasses = classes => el => classes.forEach(aClass => expect(el).not.to.have.class(aClass));
