import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render } from '@ember/test-helpers';
import { hbs } from 'ember-cli-htmlbars';
import { fillIn, find, triggerEvent } from '@ember/test-helpers';

const DEBOUNCE_MS = 500;

module('Integration | Component | job-search-box', function (hooks) {
  setupRenderingTest(hooks);

  test('debouncer debounces appropriately', async function (assert) {
    assert.expect(4);

    let message = '';

    this.set('externalAction', (value) => {
      message = value;
    });

    await render(hbs`<JobSearchBox @onFilterChange={{this.externalAction}} />`);
    const element = find('input');
    await fillIn('input', 'test1');
    assert.equal(message, 'test1', 'Initial typing');
    element.value += ' wont be ';
    triggerEvent('input', 'input');
    assert.equal(
      message,
      'test1',
      'Typing has happened within debounce window'
    );
    element.value += 'seen ';
    triggerEvent('input', 'input');
    await delay(DEBOUNCE_MS - 100);
    assert.equal(
      message,
      'test1',
      'Typing has happened within debounce window, albeit a little slower'
    );
    element.value += 'until now.';
    triggerEvent('input', 'input');
    await delay(DEBOUNCE_MS + 100);
    assert.equal(
      message,
      'test1 wont be seen until now.',
      'debounce window has closed'
    );
  });
});

function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
