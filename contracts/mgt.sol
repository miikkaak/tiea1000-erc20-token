pragma solidity ^0.4.0;

// ERC20-standardin vaatima rajapinta funktioista
contract ERC20Interface {

    function totalSupply() public constant returns (uint);

    function balanceOf(address tokenOwner) public constant returns (uint balance);

    function allowance(address tokenOwner, address spender) public constant returns (uint remaining);

    function transfer(address to, uint tokens) public returns (bool success);

    function approve(address spender, uint tokens) public returns (bool success);

    function transferFrom(address from, address to, uint tokens) public returns (bool success);

    event Sent(
        address from,
        address to,
        uint amount
        );
        
    event Approval(
        address indexed tokenOwner, 
        address indexed spender, 
        uint tokens
        );
        
}

// ERC20-standardin mukaiset funktiot toteuttava sopimus
contract MiggersToken is ERC20Interface {
    
    mapping (address => uint256) public balances;
    mapping (address => mapping(address => uint256)) allowed;
    
    address owner;
    string public name;
    string public short;
    uint8 public decimals;
    uint256 _totalSupply;
    
    constructor() public {
        owner = msg.sender; 
        _totalSupply = 100000;
        balances[msg.sender] = _totalSupply;
        name = "MiggersToken";
        short = "MGT";
        decimals = 8;
    }
    
    
    function approve(address spender, uint256 tokens) public returns (bool success) {
        allowed[msg.sender][spender] = tokens;
        emit Approval(msg.sender, spender, tokens);
        return true;
    }

    
    function transfer(address to, uint256 tokens) public returns (bool success) {
        //funktion toteutumisen edellytyksien tarkistukset
        require(balances[msg.sender] >= tokens);
        
        balances[msg.sender] -= tokens;
        balances[to] += tokens;
        emit Sent(msg.sender, to, tokens);
        return true;
    }

    /**
     * Valuutan omistaja voi antaa toiselle osoitteelle oikeuden transferFrom-funktioon
     * ja varojen siirtämiseen omalta tililtään. Palauttaa luvattujen varojen määrän.
     * @param tokenOwner omistaja joka voi antaa oikeuden
     * @param spender jolle oikeus annetaan
     */
    function allowance(address tokenOwner, address spender) public constant returns (uint256 remaining) {
        return allowed[tokenOwner][spender];
    }
    
    /**
     * to-osoite voi siirtää from-osoitteesta varoja, mikäli from-osoitteella on riittävät
     * varat transaktioon ja to-osoitteella on oikeus transaktioon. Funktio ei käytössä 
     * nyt tehdyssä käyttöliittymässä.
     * @param from osoite josta siirretään
     * @param to osoite johon siirretään
     * @param tokens määrä
     */
    function transferFrom(address from, address to, uint256 tokens) public returns (bool success) {
        uint256 allow = allowed[from][msg.sender];
        
        require(balances[from] >= tokens && allow >= tokens);
        allowed[from][msg.sender] -= tokens;
        balances[to] += tokens;
        balances[from] -= tokens;
        emit Sent(from, to, tokens);
        return true;
    }


    /**
     * palautetaan tietyn osoitteen varojen määrä
     */
    function balanceOf(address tokenOwner) public constant returns (uint256 balance) {
        return balances[tokenOwner];
    }
    
    /**
     * palautetaan total supply
     */
    function totalSupply() public constant returns(uint256) {
        return _totalSupply;
    }
}