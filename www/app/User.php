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

    /**
     * One-to-Many.
     *
     * @return \Illuminate\Database\Eloquent\Relations\BelongsToMany
     * A user has many trips
     */
    public function trips()
    {
        return $this->belongsToMany(Trip::class)->withPivot('trip_id', 'user_id');
    }

    /**
     * One-to-One.
     *
     * @return \Illuminate\Database\Eloquent\Relations\belongsToMany
     * A user has many trips
     */
    public function roles()
    {
        return $this->belongsToMany(Role::class)->withPivot('role_id', 'user_id');
    }

    public function is($roleName)
    {
        foreach ($this->roles()->get() as $role)
        {
            if ($role->name == $roleName)
            {
                return true;
            }
        }
        return false;
    }

    public function isAdmin()
    {
        foreach ($this->roles()->get() as $role)
        {
            if ($role->name == 'admin')
            {
                return true;
            }
        }

        return false;
    }
}
