// from:  https://mymemorysucks.wordpress.com/2017/05/16/alternative-patterns-for-method-overloading-in-go/?utm_source=golangweekly&utm_medium=email


//================The Functional Way

func Brew(shots int, variety string, cups int) []*Coffee {
    // Brew my coffee
}

func ALargeCoffee() (int, string, int) {
    return 3, "Robusta", 1
}

func ForTheOffice(cups int) (int, string, int) {
    return 1, "Arabica", cups
}

func AnEspresso(shots int) (int, string, int) {
    return shots, "Arabica", 1
}

func main() {
    myCoffee := Brew(ALargeCoffee())
    coffeesForEverybody := Brew(ForTheOffice(6))
    wakeUpJuice := Brew(AnEspresso(3))
}


//===================The Object Oriented Way
type CoffeeOptions struct {
    Shots int
    Variety string
    Cups int
}

func Brew(opt CoffeeOptions) []*Coffee {
    // Brew my coffee using opt.Shots, opt.Variety, and opt.Cups
}

func ALargeCoffee() *CoffeeOptions {
    return &CoffeeOptions{3, "Arabica", 1}
}

func ForTheOffice(cups int) *CoffeeOptions {
    return &CoffeeOptions{1, "Arabica", cups}
}

func AnEspresso(shots int) *CoffeeOptions {
    return &CoffeeOptions{shots, "Arabica", 1}
}

func main() {
    oneLargeCoffee := ALargeCoffee()
    myCoffee := Brew(oneLargeCoffee)
    bobsCoffee := Brew(oneLargeCoffee)

    coffees := Brew(ForTheOffice(6))

    wakeUpJuice := Brew(AnEspresso(3))
}

/*
But the above example wouldn’t be considered truly OO for some people, 
so we can go one step further and create the object like so –
*/

type CoffeeOrder struct {
    Shots int
    Variety string
    Cups int
}

func (o *CoffeeOrder) Brew() []*Coffee {
    // Brew my coffee using o.Shots, o.Variety, and o.Cups
}

func ALargeCoffee() *CoffeeOrder {
    return &CoffeeOrder{3, "Arabica", 1}
}

func ForTheOffice(cups int) *CoffeeOrder {
    return &CoffeeOrder{1, "Arabica", cups}
}

func AnEspresso(shots int) *CoffeeOrder {
    return &CoffeeOrder{shots, "Arabica", 1}
}

func main() {
    order := ALargeCoffee()
    myCoffee := order.Brew()

    coffees := ForTheOffice(6).Brew()

    wakeUpJuice := AnEspresso(3).Brew()
}