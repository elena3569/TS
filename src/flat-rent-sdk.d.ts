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
        totalPrice: number
        remoteness: number
    }

    export const database: Place[]

    export function cloneDate(date: Date): Date;

    export function addDays(date: Date, days: number): Date 

    export class FlatRentSdk {
        database: Place[]

        constructor();
        get(id: string): Promise<Place|null> 

        search(flats: Place[], parameters: SearchParametrs): Place[] 
    
        book(flatId: number, checkInDate: Date, checkOutDate: Date): number 
        
        _resetTime(date: Date): void

        _assertDatesAreCorrect(checkInDate: Date, checkOutDate: Date): void

        _calculateDifferenceInDays(startDate: Date, endDate: Date): number

        _generateDateRange(from: Date, to: Date): Date[]

        _generateTransactionId(): number

        _areAllDatesAvailable(flat, dateRange: Date[]): Place[]

        _formatFlatObject(flat: Place[], nightNumber: number): Place[]
        
        _readDatabase(): Place[]

        _writeDatabase(database: Place[]): void

        _syncDatabase(database: Place[]): void
    
    }
}