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
    mapping(uint => Item) public items;

    event List(string name, uint cost, uint quantity);

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

    // withdraw funds
}
