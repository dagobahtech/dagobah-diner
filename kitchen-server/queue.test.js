/**
 * Created by Brett Dixon on 2017-05-15.
 */
const Queue = require("./queue");

var newQueue = new Queue();

beforeAll(() => {
    newQueue.enqueue("A");
    newQueue.enqueue("B");
    newQueue.enqueue("C");
    newQueue.enqueue("D");
    newQueue.enqueue("E");
    return newQueue;
});

afterAll(() => {
    newQueue = null;
    return newQueue;
});

test("Queue size", () => {
    expect(newQueue.length).toBe(5);
});

test("Whats at the top of the Queue?", () => {
    expect(newQueue.peek()).toBe("A");
});

test("What's in the Queue?", () => {
    var temp = ["A","B","C","D","E"];
    expect(newQueue.items).toEqual(temp);
});

test("Remove from the top", () => {
    expect(newQueue.dequeue()).toBe("A");
});

test("Clear empties the queue", () => {
    newQueue.clear();
    expect(newQueue.isEmpty()).toBeTruthy;
});