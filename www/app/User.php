<?php

namespace App;

use Illuminate\Foundation\Auth\User as Authenticatable;

/**
 * App\User
 *
 * @mixin \Eloquent
 */
class User extends Authenticatable
{
    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'name', 'email', 'password',
    ];

    /**
     * The attributes that should be hidden for arrays.
     *
     * @var array
     */
    protected $hidden = [
        'password', 'remember_token', 'pivot'
    ];

    /**
     * One-to-Many.
     *
     * @return \Illuminate\Database\Eloquent\Relations\BelongsToMany
     * A user has many flights
     */
    public function flights()
    {
        return $this->belongsToMany(Flight::class)->withPivot('flight_id', 'user_id');
    }
}
