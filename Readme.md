# Slot Machine SPA

![Slot SPA screen](https://github.com/movaclub/slot-reels/blob/master/img/spaScreen.jpg)

## Tech Stack
Pure JavaScript, CSS, HTML5.

## Deployment
Just drop the project folder within a web-server space, direct your browser to it and refresh.

## Usage
There are techinically two modes: __random__ and __debug__.

_Spin_ button resets win total, i.e. _Current Spin Win_ shows only one spin win total; the same is true in debug mode about _Do Debug_ button.

* Random mode is ready to go.
* Debug mode is operable upon ticking _Debuggin Reels_ checkbox.

__NB__: _If debug mode is activated, normal spin button is disabled, and vice versa._

### Prospective to-do list or just gaps
* There is neither increamental (grand) total for a series of spins nor manual _top up_ input for making up one's balance.

* It's better to disable the whole debug form rather than just its button.

* All three reels are created out of the same sprite so mind corresponding limitations; it seems that in order to achieve the maximum flexibility in (debugging) sets, there should be some other graphic model, not sprite-based.

* It's quite reasonable to add some _transional smooth_ to animation...

* This should be re-written in _Typescript_ to follow the crowd :)
