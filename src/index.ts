const MAX_LEN = 20; // max len for leaf node

class Visitor {
	public ropes: Rope[];

	constructor() {
		this.ropes = [];
	}

	private copyInstance(original: Rope): Rope {
		let copied: Rope = Object.assign(
			Object.create(
				Object.getPrototypeOf(original)
			),
			original
		);
		return copied;
	}

	public copy(index: number, node: Rope): {ropes: Rope[], index: number} {
		if (!node.left || !node.right) {
			return {ropes: this.ropes, index: index};
		}

		if (index <= node.left.weight) {
			let copy: Rope = this.copyInstance(node.right);

			this.ropes.push(copy);
			delete node.right;

			return this.copy(index, node.left);
		} else {
			return this.copy(index - node.left.weight, node.right);
		}
	}
}

class Rope {
	public value: string;
	public weight: number;
	public left: Rope;
	public right: Rope;
	public trace: Rope[];

	constructor(value ? : string) {
		this.value = value;
		this.weight = value.length;
		this.left = null;
		this.right = null;

		this.balance();
	}

	private balance(): void {
		if (this.value.length > MAX_LEN) {
			let divisor: number = Math.floor(this.weight / 2);
			let left: Rope = new Rope(this.value.substring(0, divisor));
			let right: Rope = new Rope(this.value.substring(divisor));

			this.add(left, right);
		}
	}

	private add(left: Rope, right: Rope): void {
		this.left = left;
		this.right = right;

		delete this.value;
	}

	private findNode(index: number): Rope {
		if (typeof this.value != 'undefined') {
			return this;
		}

		if (index <= this.left.weight) {
			return this.left.findNode(index);
		} else {
			return this.right.findNode(index - this.left.weight);
		}
	}

	public insert(position: number, value: string) {
		let rope = new Rope(value);
		let right = this.split(position);


		let something = this.concat(rope);
		something = something.concat(right);
		console.log(JSON.stringify(something));
	}

	public toString(): string {
		if (typeof this.value == 'undefined') {
			return this.left.toString() + this.right.toString();
		} else {
			return this.value;
		}
	}

	public concat(rope: Rope) {
		let parent: Rope = new Rope('');

		parent.add(this, rope);

		return parent;
	}

	public split(index: number): Rope {
		//find all nodes after split point
		let visitor: Visitor = new Visitor();
		let ropes = visitor.copy(index, this);

		let ropeArr: Rope[] = ropes.ropes;
		let nodeIndex: number = ropes.index;

		ropeArr = ropeArr.reverse();

		let node: Rope = this.findNode(index);

		if (nodeIndex != node.weight) {
			let left: string = node.value.substring(0, nodeIndex);
			let right: string = node.value.substring(nodeIndex);

			node.value = left;

			ropeArr.unshift(new Rope(right));
		}

		// concat each seperation into new rope
		let combinedRopes: Rope = ropeArr[0];

		for (let i = 1; i < ropeArr.length; i++) {
			combinedRopes = combinedRopes.concat(ropeArr[i]);
		}
		return combinedRopes;
	}
}

let rope: Rope = new Rope('some random text that I want to generate a tree structure out of');