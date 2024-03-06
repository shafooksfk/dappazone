// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

contract Dappazon {
    address public owner;

    constructor() {
        owner = msg.sender;
    }

    struct Item {
        uint id;
        string name;
        string category;
        string image;
        uint cost;
        uint rating;
        uint stock;
    }
    struct Order {
        uint time;
        Item item;
    }

    event List(string name, uint cost, uint quantity);
    event Buy(address buyer, uint orderId, uint itemId);

    mapping(uint => Item) public items;
    mapping(address => uint) public orderCount;
    mapping(address => mapping(uint => Order)) public orders;

    // listing option only for owner using modifier
    modifier onlyOwner() {
        require(msg.sender == owner);
        _; // represents function body
    }

    // list products
    function list(
        uint _id,
        string memory _name,
        string memory _category,
        string memory _image,
        uint _cost,
        uint _rating,
        uint _stock
    ) public onlyOwner {
        // require(msg.sender == owner); // listing option only for owner

        // create item struct
        Item memory item = Item(
            _id,
            _name,
            _category,
            _image,
            _cost,
            _rating,
            _stock
        );

        //save item struct to blockchain
        items[_id] = item;

        //emit an event
        emit List(_name, _cost, _stock);
    }

    // buy products
    function buy(
        uint _id // payable is an inbuilt modifier used for transferring crypto
    ) public payable {
        // create an order
        Item memory item = items[_id];

        // require enough ether to buy item
        require(msg.value >= item.cost);

        // require item is in stock
        require(item.stock > 0);

        Order memory order = Order(block.timestamp, item);

        // add order for user
        orderCount[msg.sender]++; // order ID
        orders[msg.sender][orderCount[msg.sender]] = order;

        // substract stock
        items[_id].stock = item.stock - 1;
        // emit event
        emit Buy(msg.sender, orderCount[msg.sender], item.id);
    }

    // withdraw funds
    function withdraw() public onlyOwner {
        (bool success, ) = owner.call{value: address(this).balance}("");
        require(success);
    }
}
