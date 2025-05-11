import * as assert from 'assert';
import * as vscode from 'vscode';
import * as sinon from 'sinon';
import * as childProcess from 'child_process';
import * as extension from '../src/extension';

suite('Piknik Extension Tests', () => {
    let spawnStub: sinon.SinonStub;

    setup(() => {
        // Mock child_process.spawn
        spawnStub = sinon.stub(childProcess, 'spawn');
    });

    teardown(() => {
        // Restore stubs
        sinon.restore();
    });

    test('Extension should be present', () => {
        assert.ok(vscode.extensions.getExtension('jedisct1.piknik'));
    });

    test('Commands should be registered', async () => {
        const commands = await vscode.commands.getCommands();
        assert.ok(commands.includes('piknik.copy'));
        assert.ok(commands.includes('piknik.paste'));
    });

    // Configuration tests will go here

    // Tests for the piknik.copy and piknik.paste commands will go here
    // These would include mocking the child_process.spawn behavior
});