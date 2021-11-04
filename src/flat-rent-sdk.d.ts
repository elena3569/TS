declare module 'flat-rent-sdk' {
    export interface SearchParametrs {
        city: string,
        checkInDate: Date,
        checkOutDate: Date,
        priceLimit: number,
    }

    export interface Place {
        id: string,
        title: string,
        details: string,
        photos: string[],
        coordinates: [number, number],
        bookedDates: Date[],
        price: number,
        remoteness: number
    }

    export const database: Place[]

    export function cloneDate(date: Date): Date;

    export function addDays(date: Date, days: number): Date 

    export class FlatRentSdk {
        database: Place[]

        constructor();
        get(id: string): Promise<Place|null> 

        // return &&&????
        search(parameters: SearchParametrs): Object[] 
    
        book(flatId: number, checkInDate: Date, checkOutDate: Date): number 
        
        _resetTime(date: Date): void

        _assertDatesAreCorrect(checkInDate: Date, checkOutDate: Date)
        // {
        //     const today = new Date()
        //     this._resetTime(today)
        //     this._resetTime(checkInDate)
        //     this._resetTime(checkOutDate)

        //     const diffToday = this._calculateDifferenceInDays(today, checkInDate)
        //     if (diffToday < 0) {
        //         throw new Error('Check-in date can\'t be in the past.')
        //     }

        //     const diffCheck = this._calculateDifferenceInDays(checkInDate, checkOutDate)
        //     if (diffCheck < 0) {
        //         throw new Error('Check-out date must be grater then check-in date.')
        //     }
        // }

        _calculateDifferenceInDays(startDate: Date, endDate: Date): number

        _generateDateRange(from: Date, to: Date): Date[]

        _generateTransactionId(): number

        _areAllDatesAvailable(flat, dateRange: Date[]) 
        // {
        //     return dateRange.every((date) => {
        //         return !flat.bookedDates.includes(date.getTime())
        //     })
        // }

        _formatFlatObject(flat: Place[], nightNumber: number) 
        // {
        //     const formattedFlat = Object.assign({}, flat)

        //     formattedFlat.photos = formattedFlat.photos.map((photoUrl) => {
        //         return `http://localhost:${backendPort}/img/${photoUrl}`
        //     })

        //     if (nightNumber != null) {
        //         formattedFlat.totalPrice = nightNumber * formattedFlat.price
        //         delete formattedFlat.price
        //     }

        //     return formattedFlat
        // }

        _readDatabase(): Place[]

        _writeDatabase(database: Place[]): void

        _syncDatabase(database: Place[]): void
    
    }
}